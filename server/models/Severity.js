export default (database, DataTypes) => {
    const Severity = database.define(
        'severity',
        {
            severity_id: {
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
    return Severity;
};