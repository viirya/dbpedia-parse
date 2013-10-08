// Generated by CozyScript 0.1.1
(function() {

  $(document).ready(function() {
    var construct_tree, node_click, socket;
    socket = io.connect('http://cml10.csie.ntu.edu.tw:8088');
    socket.on('words', function(data) {
      var words_tree;
      window.related_words = data;
      window.init_vis();
      window.words_tree = words_tree = construct_tree(data);
      return window.update_vis(words_tree);
    });
    construct_tree = function(data) {
      var item, items, key, relation_map, subtree, tree, _i, _len;
      tree = {
        'title': window.query,
        'children': []
      };
      relation_map = {
        'subject': '擴充詞彙'
      };
      for (key in data) {
        items = data[key];
        subtree = {
          'title': relation_map[key],
          'children': []
        };
        tree['children'].push(subtree);
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          subtree['children'].push(item);
        }
      }
      return tree;
    };
    $("#query").bind("enterkey", function() {
      window.query = $(this).val();
      return socket.emit('query', $(this).val());
    });
    $("#query").keyup(function(e) {
      if (e.keyCode === 13) {
        return $(this).trigger("enterkey");
      }
    });
    window.tree_size = {
      height: 600,
      width: 1000
    };
    window.init_vis = function() {
      var svg, tree;
      window.tree = tree = d3.layout.tree().size([window.tree_size.height, window.tree_size.width]);
      window.diagonal = d3.svg.diagonal().projection(function(d) {
        return [d.y, d.x];
      });
      d3.select("svg").remove();
      return window.svg = svg = d3.select("#d3-canvas").append("svg").attr("width", window.tree_size.width).attr("height", window.tree_size.height).append("g").attr("transform", "translate(" + 200 + "," + 0 + ")");
    };
    window.update_vis = function(word_tree) {
      var diagonal, enter_nodes, exit_nodes, g_links, g_nodes, height, i, links, nodes, svg, tree, update_nodes, width;
      width = window.tree_size.width;
      height = window.tree_size.height;
      i = 0;
      if (word_tree.x0 == null) {
        word_tree.x0 = 0;
      }
      if (word_tree.y0 == null) {
        word_tree.y0 = height / 2;
      }
      tree = window.tree;
      svg = window.svg;
      diagonal = window.diagonal;
      nodes = tree.nodes(window.words_tree).reverse();
      links = tree.links(nodes);
      nodes.forEach(function(d) {
        return d.y = d.depth * 180;
      });
      g_nodes = svg.selectAll("g.node").data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });
      enter_nodes = g_nodes.enter().append("g").attr("class", "node").attr("transform", function(d) {
        return "translate(" + word_tree.y0 + "," + word_tree.x0 + ")";
      }).on("click", node_click);
      enter_nodes.append("circle").attr("r", 1e-6).style("stroke", "steelblue").style("fill", function(d) {
        if (d._children) {
          return "lightsteelblue";
        } else {
          return "#fff";
        }
      });
      enter_nodes.append("text").attr("x", function(d) {
        if (d.children || d._children) {
          return -10;
        } else {
          return 10;
        }
      }).attr("dy", ".35em").attr("text-anchor", function(d) {
        if (d.children || d._children) {
          return "end";
        } else {
          return "start";
        }
      }).text(function(d) {
        return d.title;
      }).style("fill-opacity", 1e-6);
      update_nodes = g_nodes.transition().duration(750).attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });
      update_nodes.select("circle").attr("r", 4.5).style("fill", function(d) {
        if (d._children) {
          return "lightsteelblue";
        } else {
          return "#fff";
        }
      });
      update_nodes.select("text").style("fill-opacity", 1);
      exit_nodes = g_nodes.exit().transition().duration(750).attr("transform", function(d) {
        return "translate(" + word_tree.y + "," + word_tree.x + ")";
      }).remove();
      exit_nodes.select("circle").attr("r", 1e-6);
      exit_nodes.select("text").style("fill-opacity", 1e-6);
      g_links = svg.selectAll("path.link").data(links, function(d) {
        return d.target.id;
      });
      g_links.enter().insert("path", "g").attr("class", "link").style("fill", "none").style("stroke", "#ccc").attr("d", function(d) {
        var o;
        o = {
          x: word_tree.x0,
          y: word_tree.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });
      g_links.transition().duration(750).attr("d", diagonal);
      g_links.exit().transition().duration(750).attr("d", function(d) {
        var o;
        o = {
          x: word_tree.x,
          y: word_tree.y
        };
        return diagonal({
          source: o,
          target: o
        });
      }).remove();
      return nodes.forEach(function(node) {
        node.x0 = node.x;
        return node.y0 = node.y;
      });
    };
    return node_click = function(d) {
      if (d.children != null) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      return window.update_vis(d);
    };
  });

}).call(this);
