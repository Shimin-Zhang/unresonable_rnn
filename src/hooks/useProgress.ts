import { useProgressStore } from '@/stores/progressStore'
import { MODULES, LEARNING_PATHS } from '@/lib/constants'
import { getModuleStatus, calculateProgress } from '@/lib/utils'
import type { ModuleStatus } from '@/lib/types'

export function useProgress() {
  const store = useProgressStore()

  const currentPath = store.currentPath
    ? LEARNING_PATHS[store.currentPath as keyof typeof LEARNING_PATHS]
    : null

  const pathModules = currentPath
    ? currentPath.modules.map((id) => MODULES[id])
    : MODULES

  const progress = calculateProgress(store.completedModules, pathModules.length)

  const getStatus = (moduleId: number): ModuleStatus => {
    return getModuleStatus(moduleId, store.completedModules, store.currentModule)
  }

  const nextModule = pathModules.find(
    (module) => !store.completedModules.includes(module.id)
  )

  return {
    ...store,
    currentPath,
    pathModules,
    progress,
    getStatus,
    nextModule,
  }
}
