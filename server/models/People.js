export default (database, DataTypes) => {
    const People = database.define(
        'people',
        {
            person_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
            }
        },
        { freezeTableName: true, timestamps: false }
    );
    return People;
};