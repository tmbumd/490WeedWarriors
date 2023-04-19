export default (database, DataTypes) => {
  const Catalog = database.define(
    'catalog',
    {
      catalog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      symbol: {
        type: DataTypes.GEOMETRY('POLYGON'),
        allowNull: false
      },
      latin_name: {
        type: DataTypes.STRING
      },
      common_name: {
        type: DataTypes.STRING
      }
    },
    { freezeTableName: true, timestamps: false }
  );
  return Catalog;
};
