<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="A cross-platform financial charting application to showcase the functionality of d3fc components">
    <title>BitFlux</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <!-- Version: <%- version %> -->
</head>
<body>
<div id="app-container"></div>
<% if (development) { %>
<% _.forEach(developmentVendorJsFiles, function(filePath) {
%><script src="<%- filePath %>"></script>
<%
}); %>
<% } %>
<script src="<%- appJsPath %>"></script>
<%= liveReload === true ? '<script src="//localhost:35729/livereload.js"></script>' : '' %>
</body>
</html>
