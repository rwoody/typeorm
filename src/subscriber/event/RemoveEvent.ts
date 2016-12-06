/**
 * RemoveEvent is an object that broadcaster sends to the entity subscriber when entity is being removed to the database.
 */
export interface RemoveEvent<Entity> {

    /**
     * Entity that is being removed.
     * This may absent if entity is removed without being loaded (for examples by cascades).
     */
    entity?: Entity;

    /**
     * Database representation of entity that is being removed.
     */
    databaseEntity: Entity;

    /**
     * Id or ids of the entity that is being removed.
     */
    entityId?: any;

}