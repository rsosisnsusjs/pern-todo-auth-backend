const express = require("express");
const app = require("./app");
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

if (process.env.NODE_ENV === 'test') {
    module.exports = { app, server };
} else {
    module.exports = app;
}
