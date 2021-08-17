const CracoLessPlugin = require('craco-less');
const CracoAntDesignPlugin = require("craco-antd");

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          "@primary-color": "#01283a",
        },
      },
        },
    ],
};