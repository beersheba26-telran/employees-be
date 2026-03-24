import { Employee } from "../models/Employee.js";
import employeesService from "../service/EmployeesServiceImpl.js";
import { Faker, en } from '@faker-js/faker';
import logger from "../logger.js";
export default async function seed_dev(nEmployees: number): Promise<void> {
    const employees: Employee[] = await employeesService.getAll()
    if (employees.length == 0) {
        logger.debug(`service data not found`)
        const randomEmployees: Employee[] = getRandomEmployees(nEmployees);
        for (let i = 0; i < randomEmployees.length; i++) {
            await employeesService.addEmployee(randomEmployees[i]!)
        }
        logger.debug("dev seed has filled the data")
    } else {
        logger.debug("service has data - no generation will be perfomed")
    }
}

const faker = new Faker({ locale: [en] });
const N_EMPLOYEES = 100;
const MIN_SALARY = 5000;
const MAX_SALARY = 50000;
const MIN_AGE = 20;
const MAX_AGE = 75;
const DEPARTMENTS = ["QA", "Development", "Audit", "Accounting","Management"];
function createRandomEmployee(): Employee {
    const res: Partial<Employee> = {};
    const gender = faker.helpers.arrayElement(["female", "male"])
    res.id = faker.string.uuid();
    res.department = faker.helpers.arrayElement(DEPARTMENTS);
    res.fullName = faker.person.fullName({sex: gender});
    res.avatar = getAvatar(gender);
    res.salary = faker.number.int({min:MIN_SALARY, max: MAX_SALARY, multipleOf:100});
    res.birthdate = faker.date.birthdate({min: MIN_AGE, max: MAX_AGE, mode: "age"}).toISOString().substring(0, 10);
    return res as Employee;
}
function randomAvatarUrl() {
  const seed = Math.random().toString(36).slice(2);
  return `https://api.dicebear.com/9.x/personas/svg?seed=${seed}`;
}


function getAvatar(gender: string) {
  let res = faker.image.avatar();
  if (res.includes("github")){
    res = randomAvatarUrl()
  } else{
     res = gender == "male" ? res.replace("female", "male") : res.replace("/male", "/female");
  }
 
  return res;
}
function getRandomEmployees(nEmployees: number): Employee[] {
   return Array.from({length: nEmployees}, () => createRandomEmployee());

}

