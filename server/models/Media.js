export default (database, DataTypes) => {
    const Media = database.define(
        'media',
        {
            media_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        { freezeTableName: true, timestamps: false }
    );
    return Media;
};