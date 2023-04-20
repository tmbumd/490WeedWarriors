export default (database, DataTypes) => {
    const Reports = database.define(
        'reports',
        {
            report_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            catalog_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            location: {
                type: DataTypes.GEOMETRY('POLYGON'),
                allowNull: false
            },
            severity_id:{   
                type: DataTypes.INTEGER,
                allowNull: false
            },
            media_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            person_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            verified:{
                type: DataTypes.BOOLEAN,
                allowNull: false
            }

        },
        { freezeTableName: true, timestamps: false }
    );
    return Reports;
};