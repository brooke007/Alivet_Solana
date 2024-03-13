/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/*.css"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  browserNodeBuiltinsPolyfill: {
    modules: {
      http: true,
      https: true,
      zlib: true,
      util: true,
      url: true,
      stream: true,
      assert: true,
      string_decoder: true,
      events: true,
      buffer: true,
      fs: true,
      crypto: true
    }, globals: {
      Buffer: true,
    },
  },
};
