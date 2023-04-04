node_modules/uglify-js/bin/uglifyjs -c -o release/realsimple.min.js src/overrides.js src/cookiehelper.js src/cssrule.js src/cssstyle.js src/cssanimation.js src/datehelper.js src/dialog.js src/rs.js src/rsobject.js src/dom.js src/rspromise.js src/http.js src/local.js src/geo.js src/pubsub.js src/restful.js src/view.js src/modal.js src/watcher.js src/validations.js src/activity.js
echo "realsimple.min.js generated."

node_modules/uglify-js/bin/uglifyjs -b -o release/realsimple.js src/overrides.js src/cookiehelper.js src/cssrule.js src/cssstyle.js src/cssanimation.js src/datehelper.js src/dialog.js src/rs.js src/rsobject.js src/dom.js src/rspromise.js src/http.js src/local.js src/geo.js src/pubsub.js src/restful.js src/view.js src/modal.js src/watcher.js src/validations.js src/activity.js
echo "realsimple.js generated."

cp src/realsimple.css release/realsimple.css
echo "realsimple.css copied."

node_modules/uglifycss/uglifycss src/realsimple.css > release/realsimple.min.css
echo "realsimple.min.css generated."
echo ""
echo "DONEZO!"