export default (database, DataTypes) => {
    const Reports = database.define(
        'reports',
        {
            report_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
        },
        { freezeTableName: true, timestamps: false }
    );
    return Reports;
};