warning: LF will be replaced by CRLF in public/js/webpack/bundle.js.
The file will have its original line endings in your working directory
warning: LF will be replaced by CRLF in src/app/components/App.vue.
The file will have its original line endings in your working directory
[1mdiff --git a/public/js/webpack/bundle.js b/public/js/webpack/bundle.js[m
[1mindex fa08897..a87633c 100644[m
[1m--- a/public/js/webpack/bundle.js[m
[1m+++ b/public/js/webpack/bundle.js[m
[36m@@ -94,7 +94,7 @@[m
 /***/ (function(module, exports, __webpack_require__) {[m
 [m
 "use strict";[m
[31m-eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\nexports.default = {\n  created: function created() {\n    getUser();\n  },\n  methods: {\n    getUser: function getUser() {\n      if (auth.currentUser) {\n        console.log(auth.currentUser.email);\n      } else {\n        console.log(\"No autenticado\");\n      }\n    }\n  }\n};\n\n//# sourceURL=webpack:///./src/app/components/App.vue?./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options");[m
[32m+[m[32meval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\nexports.default = {};\n\n//# sourceURL=webpack:///./src/app/components/App.vue?./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options");[m
 [m
 /***/ }),[m
 [m
[1mdiff --git a/src/app/components/App.vue b/src/app/components/App.vue[m
[1mindex 7287aab..8f802d2 100644[m
[1m--- a/src/app/components/App.vue[m
[1m+++ b/src/app/components/App.vue[m
[36m@@ -19,18 +19,5 @@[m
 </template>[m
 <script>[m
 export default {[m
[31m-   [m
[31m-    created(){[m
[31m-        getUser()[m
[31m-    },[m
[31m-    methods:{[m
[31m-        getUser(){[m
[31m-            if(auth.currentUser){[m
[31m-                console.log(auth.currentUser.email)[m
[31m-            }else{[m
[31m-                console.log("No autenticado")[m
[31m-            }[m
[31m-        }[m
[31m-    }[m
 }[m
 </script>[m
