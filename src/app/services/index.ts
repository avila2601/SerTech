// DEPRECATED: Legacy services directory
// Services have been migrated to proper Clean Architecture structure:
// - Application services: core/application/services/
// - Infrastructure services: infrastructure/driven-adapters/
//
// This export is kept for backward compatibility, but new imports should use:
// import { UserStateService } from '../core/application/services'

export { UserStateService } from '../core/application/services/user-state.service';
