'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils'
import { useResponsiveD3, getColorScale } from './hooks/useD3'
import type {
  NetworkData,
  NetworkNode,
  NetworkConnection,
  VisualizationBaseProps,
  InteractionCallbacks,
  ColorScheme,
} from './types'

export interface NetworkDiagramProps
  extends VisualizationBaseProps,
    InteractionCallbacks<NetworkNode | NetworkConnection> {
  data: NetworkData
  showLabels?: boolean
  showWeights?: boolean
  nodeRadius?: number
  connectionWidth?: number | ((conn: NetworkConnection) => number)
}

export interface NetworkDiagramRef {
  highlightNode: (nodeId: string | null) => void
  highlightPath: (nodeIds: string[]) => void
  updateActivations: (activations: Record<string, number>) => void
  zoomTo: (nodeId: string, scale?: number) => void
  resetView: () => void
}

const NetworkDiagram = forwardRef<NetworkDiagramRef, NetworkDiagramProps>(
  (
    {
      data,
      width,
      height,
      className,
      colorScheme = 'viridis',
      animated = true,
      showLabels = true,
      showWeights = false,
      nodeRadius = 20,
      connectionWidth = 2,
      onHover,
      onClick,
      onReady,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement | null>(null)
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)

    const getConnectionWidth = useCallback(
      (conn: NetworkConnection) =>
        typeof connectionWidth === 'function' ? connectionWidth(conn) : connectionWidth,
      [connectionWidth]
    )

    const render = useCallback(
      (
        container: d3.Selection<HTMLDivElement, unknown, null, undefined>,
        dimensions: { width: number; height: number }
      ) => {
        const { width: w, height: h } = dimensions
        const margin = { top: 40, right: 40, bottom: 40, left: 40 }
        const innerWidth = w - margin.left - margin.right
        const innerHeight = h - margin.top - margin.bottom

        // Clear previous content
        container.selectAll('*').remove()

        // Create SVG
        const svg = container
          .append('svg')
          .attr('width', w)
          .attr('height', h)
          .attr('viewBox', `0 0 ${w} ${h}`)

        svgRef.current = svg.node()

        // Create zoom behavior
        const zoom = d3
          .zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.5, 4])
          .on('zoom', (event) => {
            g.attr('transform', event.transform)
          })

        svg.call(zoom)
        zoomRef.current = zoom

        // Create main group
        const g = svg
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`)

        // Calculate node positions based on layers
        const layers = [...new Set(data.nodes.map((n) => n.layer))].sort((a, b) => a - b)
        const layerWidth = innerWidth / Math.max(layers.length - 1, 1)

        const nodesByLayer = new Map<number, NetworkNode[]>()
        data.nodes.forEach((node) => {
          const layerNodes = nodesByLayer.get(node.layer) || []
          layerNodes.push(node)
          nodesByLayer.set(node.layer, layerNodes)
        })

        // Position nodes
        const nodePositions = new Map<string, { x: number; y: number }>()
        layers.forEach((layer, layerIndex) => {
          const layerNodes = nodesByLayer.get(layer) || []
          const layerHeight = innerHeight / Math.max(layerNodes.length + 1, 2)

          layerNodes.forEach((node, nodeIndex) => {
            const pos = node.position || {
              x: layerIndex * layerWidth,
              y: (nodeIndex + 1) * layerHeight,
            }
            nodePositions.set(node.id, pos)
          })
        })

        // Color scale for activations
        const colorScale = getColorScale(colorScheme)

        // Arrow marker
        svg
          .append('defs')
          .append('marker')
          .attr('id', 'arrowhead')
          .attr('viewBox', '-0 -5 10 10')
          .attr('refX', nodeRadius + 8)
          .attr('refY', 0)
          .attr('orient', 'auto')
          .attr('markerWidth', 6)
          .attr('markerHeight', 6)
          .append('path')
          .attr('d', 'M 0,-5 L 10,0 L 0,5')
          .attr('fill', '#64748b')

        // Draw connections
        const connections = g
          .append('g')
          .attr('class', 'connections')
          .selectAll('path')
          .data(data.connections)
          .join('path')
          .attr('class', 'connection')
          .attr('d', (conn) => {
            const source = nodePositions.get(conn.source)
            const target = nodePositions.get(conn.target)
            if (!source || !target) return ''

            // Curved path
            const midX = (source.x + target.x) / 2
            return `M ${source.x} ${source.y} Q ${midX} ${source.y} ${midX} ${(source.y + target.y) / 2} T ${target.x} ${target.y}`
          })
          .attr('fill', 'none')
          .attr('stroke', '#94a3b8')
          .attr('stroke-width', (conn) => getConnectionWidth(conn))
          .attr('stroke-opacity', 0.6)
          .attr('marker-end', 'url(#arrowhead)')
          .style('cursor', 'pointer')
          .on('mouseenter', function (event, conn) {
            d3.select(this).attr('stroke', '#3b82f6').attr('stroke-opacity', 1)
            onHover?.(conn)
          })
          .on('mouseleave', function () {
            d3.select(this).attr('stroke', '#94a3b8').attr('stroke-opacity', 0.6)
            onHover?.(null)
          })
          .on('click', (event, conn) => {
            onClick?.(conn)
          })

        // Animate connections if animated
        if (animated) {
          connections.each(function () {
            const path = d3.select(this)
            const length = (this as SVGPathElement).getTotalLength()
            path
              .attr('stroke-dasharray', `${length} ${length}`)
              .attr('stroke-dashoffset', length)
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0)
          })
        }

        // Show weights on connections
        if (showWeights) {
          g.append('g')
            .attr('class', 'weights')
            .selectAll('text')
            .data(data.connections.filter((c) => c.weight !== undefined))
            .join('text')
            .attr('x', (conn) => {
              const source = nodePositions.get(conn.source)
              const target = nodePositions.get(conn.target)
              return source && target ? (source.x + target.x) / 2 : 0
            })
            .attr('y', (conn) => {
              const source = nodePositions.get(conn.source)
              const target = nodePositions.get(conn.target)
              return source && target ? (source.y + target.y) / 2 - 5 : 0
            })
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#64748b')
            .text((conn) => conn.weight?.toFixed(2) || '')
        }

        // Draw nodes
        const nodeGroups = g
          .append('g')
          .attr('class', 'nodes')
          .selectAll('g')
          .data(data.nodes)
          .join('g')
          .attr('class', 'node')
          .attr('transform', (node) => {
            const pos = nodePositions.get(node.id)
            return pos ? `translate(${pos.x},${pos.y})` : ''
          })
          .style('cursor', 'pointer')
          .on('mouseenter', function (event, node) {
            d3.select(this).select('circle').attr('stroke-width', 3)
            onHover?.(node)
          })
          .on('mouseleave', function () {
            d3.select(this).select('circle').attr('stroke-width', 2)
            onHover?.(null)
          })
          .on('click', (event, node) => {
            onClick?.(node)
          })

        // Node shapes based on type
        nodeGroups.each(function (node) {
          const group = d3.select(this)
          const activation = node.activation ?? 0.5
          const fillColor = colorScale(activation)

          if (node.type === 'lstm' || node.type === 'gate') {
            // Rectangle for LSTM/gate nodes
            group
              .append('rect')
              .attr('x', -nodeRadius)
              .attr('y', -nodeRadius)
              .attr('width', nodeRadius * 2)
              .attr('height', nodeRadius * 2)
              .attr('rx', 4)
              .attr('fill', fillColor)
              .attr('stroke', '#1e293b')
              .attr('stroke-width', 2)
          } else {
            // Circle for other nodes
            group
              .append('circle')
              .attr('r', nodeRadius)
              .attr('fill', fillColor)
              .attr('stroke', '#1e293b')
              .attr('stroke-width', 2)
          }
        })

        // Node labels
        if (showLabels) {
          nodeGroups
            .append('text')
            .attr('dy', nodeRadius + 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#334155')
            .text((node) => node.label || node.id)
        }

        // Layer labels
        g.append('g')
          .attr('class', 'layer-labels')
          .selectAll('text')
          .data(layers)
          .join('text')
          .attr('x', (layer, i) => i * layerWidth)
          .attr('y', -20)
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('font-weight', '500')
          .attr('fill', '#64748b')
          .text((layer, i) => {
            if (i === 0) return 'Input'
            if (i === layers.length - 1) return 'Output'
            return `Hidden ${i}`
          })

        // Entrance animation
        if (animated) {
          nodeGroups
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .delay((_, i) => i * 50)
            .attr('opacity', 1)
        }

        onReady?.()
      },
      [
        data,
        colorScheme,
        animated,
        showLabels,
        showWeights,
        nodeRadius,
        getConnectionWidth,
        onHover,
        onClick,
        onReady,
      ]
    )

    const divRef = useResponsiveD3<HTMLDivElement>(render, [
      data,
      colorScheme,
      animated,
      showLabels,
      showWeights,
      nodeRadius,
      connectionWidth,
    ])

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      highlightNode: (nodeId: string | null) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)

        svg.selectAll('.node').attr('opacity', nodeId ? 0.3 : 1)
        if (nodeId) {
          svg
            .selectAll('.node')
            .filter((d) => (d as NetworkNode).id === nodeId)
            .attr('opacity', 1)
        }
      },

      highlightPath: (nodeIds: string[]) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)
        const nodeSet = new Set(nodeIds)

        svg.selectAll('.node').attr('opacity', nodeIds.length ? 0.3 : 1)
        svg
          .selectAll('.node')
          .filter((d) => nodeSet.has((d as NetworkNode).id))
          .attr('opacity', 1)

        svg.selectAll('.connection').attr('stroke-opacity', nodeIds.length ? 0.1 : 0.6)
        svg
          .selectAll('.connection')
          .filter((d) => {
            const conn = d as NetworkConnection
            return nodeSet.has(conn.source) && nodeSet.has(conn.target)
          })
          .attr('stroke-opacity', 1)
          .attr('stroke', '#3b82f6')
      },

      updateActivations: (activations: Record<string, number>) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)
        const colorScale = getColorScale(colorScheme)

        svg.selectAll('.node').each(function (d) {
          const node = d as NetworkNode
          const activation = activations[node.id]
          if (activation !== undefined) {
            d3.select(this)
              .select('circle, rect')
              .transition()
              .duration(300)
              .attr('fill', colorScale(activation))
          }
        })
      },

      zoomTo: (nodeId: string, scale: number = 2) => {
        if (!svgRef.current || !zoomRef.current) return
        const svg = d3.select(svgRef.current)

        svg.selectAll('.node').each(function (d) {
          const node = d as NetworkNode
          if (node.id === nodeId) {
            const transform = d3.select(this).attr('transform')
            const match = transform?.match(/translate\(([^,]+),([^)]+)\)/)
            if (match) {
              const x = parseFloat(match[1])
              const y = parseFloat(match[2])
              const rect = svgRef.current!.getBoundingClientRect()
              svg
                .transition()
                .duration(750)
                .call(
                  zoomRef.current!.transform,
                  d3.zoomIdentity
                    .translate(rect.width / 2, rect.height / 2)
                    .scale(scale)
                    .translate(-x - 40, -y - 40)
                )
            }
          }
        })
      },

      resetView: () => {
        if (!svgRef.current || !zoomRef.current) return
        d3.select(svgRef.current)
          .transition()
          .duration(750)
          .call(zoomRef.current.transform, d3.zoomIdentity)
      },
    }))

    return (
      <div
        ref={divRef}
        className={cn('w-full h-full min-h-[300px]', className)}
        style={{ width: width || '100%', height: height || '100%' }}
      />
    )
  }
)

NetworkDiagram.displayName = 'NetworkDiagram'

export { NetworkDiagram }
