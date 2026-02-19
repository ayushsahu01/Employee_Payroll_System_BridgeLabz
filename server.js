import express from "express"
import { readFromFile, writeToFile } from "./modules/fileHandler.js";

const app = express();

app.set("view engine", "ejs")
app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    try {
        const employees = await readFromFile()
        const totalBasicSalary = employees.reduce((sum, e) => sum + Number(e.salary), 0);
        const totalTax = totalBasicSalary * 0.12;
        const totalNetSalary = totalBasicSalary - totalTax;

        const search = req.query.search || '';
        const filtered = search
            ? employees.filter(e =>
                e.name.toLowerCase().includes(search.toLowerCase()) ||
                e.department.toLowerCase().includes(search.toLowerCase())
            )
            : employees;

        res.render("index", { employees: filtered, totalBasicSalary, totalTax, totalNetSalary, search })
    }
    catch (error) {
        return res.status(500).send("Failed")
    }
})

app.get('/employees/create', (req, res) => {
    res.render('add');
})

app.post('/employees/create', async (req, res) => {
    try {
        const employees = await readFromFile();

        const employee = {
            id: employees.length > 0 ? employees[employees.length - 1].id + 1 : 1,
            ...req.body
        }

        employees.push(employee)

        await writeToFile(employees);

        res.redirect('/')
    }
    catch (error) {

    }
})

app.post('/employees/delete/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        if (!employeeId) {
            return res.status(400).send("Employee ID is required to delete")
        }
        const employees = await readFromFile();

        const updatedEmployees = employees.filter(e => e.id.toString() !== employeeId)

        await writeToFile(updatedEmployees)

        res.redirect('/');
    }
    catch (error) {
        return res.status(500).send("Failed to delete the employee");
    }
})

app.get('/employees/edit/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employees = await readFromFile();
        const employee = employees.find(e => e.id.toString() === employeeId);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }
        res.render('update', { employee });
    }
    catch (error) {
        res.status(500).send("Failed to load employee details");
    }
})

app.post('/employees/edit/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(400).send("Employee ID is required to edit")
        }
        const employees = await readFromFile();

        const employee = employees.find(e => e.id.toString() === employeeId);

        if (!employee) {
            return res.status(404).send("Student not found");
        }

        const updatedEmployees = employees.map((e) => e.id.toString() === employeeId ? { ...e, ...req.body, id: e.id } : e);

        await writeToFile(updatedEmployees)

        res.redirect('/')
    }
    catch (error) {
        res.status(500).send("Failed to update employee details")
    }
})

app.listen(8000)