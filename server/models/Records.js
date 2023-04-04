export default (database, DataTypes) => {
    const Records = database.define(
      'records',
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        geom: {
          type: DataTypes.GEOMETRY('POINT'),
          allowNull: false
        },
        name: {
          type: DataTypes.STRING
        }
      },
      { freezeTableName: true, timestamps: false }
    );
    return Records;
  };
  