import JSONServer from "json-server";

const server = JSONServer.create();
const router = JSONServer.router("db.json");
const middlewares = JSONServer.defaults();

const PORT = 3001;

server.use(middlewares);
server.use(JSONServer.bodyParser);

// Custom route for paginated and filtered users
server.get("/api/users", (req, res) => {
  const { page = 1, pageSize = 10, sort, sortOrder, filter } = req.query;
  const db = router.db.get("users").value();
  let results = [...db];

  // Apply filtering
  if (filter) {
    const searchTerm = filter.toString().toLowerCase();
    results = results.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting
  if (sort) {
    results.sort((a, b) => {
      const field = sort.toString();
      const order = sortOrder === "desc" ? -1 : 1;
      if (a[field] < b[field]) return -order;
      if (a[field] > b[field]) return order;
      return 0;
    });
  }

  // Apply pagination
  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);
  const start = (pageNum - 1) * pageSizeNum;
  const end = start + pageSizeNum;
  const paginatedResults = results.slice(start, end);

  // Response format matching DataSourceResponse<User>
  res.json({
    data: paginatedResults,
    meta: {
      total: results.length,
    },
  });
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
