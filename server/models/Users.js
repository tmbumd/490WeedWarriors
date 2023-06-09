export default (database, DataTypes) => {
    const Users = database.define(
        'users',
        {
            user_id: {
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
                allowNull: false
            }
        },
        { freezeTableName: true, timestamps: false }
    );
    return Users;
};