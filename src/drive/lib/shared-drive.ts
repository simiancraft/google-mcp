import type { drive_v3 } from '@googleapis/drive';
import type { SharedDrive } from '../entities/SharedDrive.js';

/** The `fields` selection backing the SharedDrive projection. */
export const SHARED_DRIVE_FIELDS =
  'id,name,colorRgb,themeId,backgroundImageLink,createdTime,hidden,' +
  'restrictions(adminManagedRestrictions,copyRequiresWriterPermission,domainUsersOnly,' +
  'driveMembersOnly,sharingFoldersRequiresOrganizerPermission)';

/** Project a REST shared drive onto the SharedDrive shape, cleaning nulls to undefined. */
export function projectSharedDrive(data: drive_v3.Schema$Drive): SharedDrive {
  return {
    id: data.id ?? '',
    name: data.name ?? undefined,
    colorRgb: data.colorRgb ?? undefined,
    themeId: data.themeId ?? undefined,
    backgroundImageLink: data.backgroundImageLink ?? undefined,
    createdTime: data.createdTime ?? undefined,
    hidden: data.hidden ?? undefined,
    restrictions: data.restrictions
      ? {
          adminManagedRestrictions: data.restrictions.adminManagedRestrictions ?? undefined,
          copyRequiresWriterPermission: data.restrictions.copyRequiresWriterPermission ?? undefined,
          domainUsersOnly: data.restrictions.domainUsersOnly ?? undefined,
          driveMembersOnly: data.restrictions.driveMembersOnly ?? undefined,
          sharingFoldersRequiresOrganizerPermission:
            data.restrictions.sharingFoldersRequiresOrganizerPermission ?? undefined,
        }
      : undefined,
  };
}
