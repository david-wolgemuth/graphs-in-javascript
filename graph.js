// Graph Object

module.exports = Graph;

var Vertex = require("./vertex.js");
var Edge = require("./edge.js");

function Graph ()
{
    this._vertices = {};
}

Graph.prototype.vertex = function(id)
{
    return (this._vertices[id]) ? this._vertices[id] : null;
};

Graph.prototype.eachVertex = function (cb, args)
{
    if (!cb) {
        return;
    }
    args = args || {};
    for (var key in this._vertices) {
        if (args.unvisited && this.vertex(id).visited()) {
            continue;
        }
        cb(this.vertex(key));
    }
};

Graph.prototype.addVertex = function(id)
{
    if (this._vertices[id]) {
        return;
    }
    this._vertices[id] = new Vertex(id);
};

Graph.prototype.addEdge = function(from, to, args)
{
    args = args || {};
    if (!from || !to) {
        return;
    }
    if (!this._vertices[from]) {
        this.addVertex(from);
    }
    if (!this._vertices[to]) {
        this.addVertex(to);
    }
    this._vertices[from].connect(to);
    if (args.twoWay) {
        this._vertices[to].connect(from);
    }
};

Graph.prototype._unvisitAllVertices = function ()
{
    for (var id in this._vertices) {
        this.vertex(id).unvisit();
    }    
};

Graph.prototype.allConnections = function (vertex)  // Depth First Search
{
    this._unvisitAllVertices();
    var all = [];
    this._allConnections(vertex, all);
    return all;
};

Graph.prototype._allConnections = function (vertexId, all)
{
    var vertex = this.vertex(vertexId);
    if (!vertex) {
        return;
    }
    var self = this;
    vertex.eachNeighboringVertex(function (neighborId) {
        neighbor = self.vertex(neighborId);
        if (neighbor.visited()) {
            return;
        }
        all.push(neighborId);
        neighbor.visit();
        self._allConnections(neighborId, all);
    });
};

Graph.prototype.pathExists = function(vertexA, vertexB)  // Depth First Search
{
    this._unvisitAllVertices();
    return this._pathExists(vertexA, vertexB);
};

Graph.prototype._pathExists = function  (vertexA, vertexB)
{
    if (typeof vertexA === "undefined" || typeof vertexB === "undefined") {
        return false;
    }
    if (!this._vertices[vertexA] || !this._vertices[vertexB]) {
        return false;
    }
    var found = false;
    var self = this;
    this.vertex(vertexA).eachNeighboringVertex(function (neighborId) {
        if (found || self.vertex(neighborId).visited()) {
            return;
        }
        self.vertex(neighborId).visit();
        if (neighborId === vertexB || self._pathExists(neighborId, vertexB)) {
            found = true;
        }
    });
    return found;
};

Graph.prototype.size = function() {
    var count = 0;
    for (var id in this._vertices) {
        if (this._vertices.hasOwnProperty(id)) {
            count++;
        }
    }
    return count;
};

