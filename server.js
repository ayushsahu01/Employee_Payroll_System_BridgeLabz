const express = require("express");
const app = express();
const fileHandler = require("./modules/fileHandler");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

(async () => {
  const data = await fileHandler.read();
  console.log("Employees Data:", data);
})();


app.get("/", async (req, res) => {
  const employees = await fileHandler.read();
  res.render("index", { employees });
});


app.get("/add", (req, res) => {
  res.render("add");
});


app.post("/add", async (req, res) => {
  const employees = await fileHandler.read();

  const newEmployee = {
    id: Date.now(),
    name: req.body.name,
    department: req.body.department,
    salary: Number(req.body.salary)
  };

  employees.push(newEmployee);
  await fileHandler.write(employees);

  res.redirect("/");
});


app.get("/edit/:id", async (req, res) => {
  const employees = await fileHandler.read();
  const emp = employees.find(e => e.id == req.params.id);
  res.render("edit", { emp });
});


app.post("/edit/:id", async (req, res) => {
  let employees = await fileHandler.read();

  employees = employees.map(emp =>
    emp.id == req.params.id
      ? {
          ...emp,
          name: req.body.name,
          department: req.body.department,
          salary: Number(req.body.salary)
        }
      : emp
  );

  await fileHandler.write(employees);
  res.redirect("/");
});


app.get("/delete/:id", async (req, res) => {
  let employees = await fileHandler.read();
  employees = employees.filter(e => e.id != req.params.id);
  await fileHandler.write(employees);
  res.redirect("/");
});


app.listen(7054, () => {
  console.log("Server running → http://localhost:7054");
});
