export default (database, DataTypes) => {
    const Severity = database.define(
        'severity',
        {
            severity_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING
            }
        },
        { freezeTableName: true, timestamps: false }
    );
    return Severity;
};