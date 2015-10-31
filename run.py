from flask import *
import flask


app = Flask(__name__)

# @app.route('/guide/post/<name>')
# @app.route('/guide')

# @app.route('/post/<name>')
@app.route('/')
def post_name(name=""):
    return send_file('index.html')

@app.route('/test')
def post_test(name=""):
    return send_file('test.html')

@app.route('/<id>')
def route_id(id):
    return flask.request.path

@app.route('/bower_components/<path:path>')
def bower_components(path):
    return send_from_directory('./bower_components/', path)

# @app.route('/<path:path>')
# def static_proxy(path):
#   # send_static_file will guess the correct MIME type
#   return app.send_static_file(path)

@app.route('/posts/<path:filename>')
def posts(filename):
    return send_from_directory('./posts/', filename, cache_timeout=0)

@app.route('/template/<path:filename>')
def template(filename):
    return send_from_directory('./template/', filename)

app.run(debug=True,host="0.0.0.0")
