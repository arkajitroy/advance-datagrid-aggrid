import JSONServer from "json-server";

const server = JSONServer.create();
const router = JSONServer.router("db.json");
const middlewares = JSONServer.defaults();
const port = 3001;

server.use(middlewares);
server.use(JSONServer.bodyParser);

server.get("/api/users", (req, res) => {
  const { page = "1", pageSize = "10", sort, sortOrder, filter } = req.query;
  const db = router.db.get("users").value();
  let results = [...db];

  if (filter) {
    const searchTerm = filter.toString().toLowerCase();
    results = results.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
  }

  if (sort) {
    results.sort((a, b) => {
      const field = sort.toString();
      const order = sortOrder === "desc" ? -1 : 1;
      return a[field] < b[field] ? -order : a[field] > b[field] ? order : 0;
    });
  }

  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);
  const start = (pageNum - 1) * pageSizeNum;
  const paginatedResults = results.slice(start, start + pageSizeNum);

  res.json({
    data: paginatedResults,
    meta: { total: results.length },
  });
});

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
