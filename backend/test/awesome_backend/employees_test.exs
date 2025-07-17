defmodule AwesomeBackend.EmployeesTest do
  use AwesomeBackend.DataCase

  alias AwesomeBackend.Employees

  describe "employees" do
    alias AwesomeBackend.Employees.Employee

    import AwesomeBackend.EmployeesFixtures

    @invalid_attrs %{name: nil, title: nil, location: nil, department: nil, avatar: nil, email: nil, phone: nil, bio: nil, start_date: nil, skills: nil, direct_reports: nil, parent_id: nil}

    test "list_employees/0 returns all employees" do
      employee = employee_fixture()
      assert Employees.list_employees() == [employee]
    end

    test "get_employee!/1 returns the employee with given id" do
      employee = employee_fixture()
      assert Employees.get_employee!(employee.id) == employee
    end

    test "create_employee/1 with valid data creates a employee" do
      valid_attrs = %{name: "some name", title: "some title", location: "some location", department: "some department", avatar: "some avatar", email: "some email", phone: "some phone", bio: "some bio", start_date: ~D[2025-07-15], skills: "some skills", direct_reports: 42, parent_id: 42}

      assert {:ok, %Employee{} = employee} = Employees.create_employee(valid_attrs)
      assert employee.name == "some name"
      assert employee.title == "some title"
      assert employee.location == "some location"
      assert employee.department == "some department"
      assert employee.avatar == "some avatar"
      assert employee.email == "some email"
      assert employee.phone == "some phone"
      assert employee.bio == "some bio"
      assert employee.start_date == ~D[2025-07-15]
      assert employee.skills == "some skills"
      assert employee.direct_reports == 42
      assert employee.parent_id == 42
    end

    test "create_employee/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Employees.create_employee(@invalid_attrs)
    end

    test "update_employee/2 with valid data updates the employee" do
      employee = employee_fixture()
      update_attrs = %{name: "some updated name", title: "some updated title", location: "some updated location", department: "some updated department", avatar: "some updated avatar", email: "some updated email", phone: "some updated phone", bio: "some updated bio", start_date: ~D[2025-07-16], skills: "some updated skills", direct_reports: 43, parent_id: 43}

      assert {:ok, %Employee{} = employee} = Employees.update_employee(employee, update_attrs)
      assert employee.name == "some updated name"
      assert employee.title == "some updated title"
      assert employee.location == "some updated location"
      assert employee.department == "some updated department"
      assert employee.avatar == "some updated avatar"
      assert employee.email == "some updated email"
      assert employee.phone == "some updated phone"
      assert employee.bio == "some updated bio"
      assert employee.start_date == ~D[2025-07-16]
      assert employee.skills == "some updated skills"
      assert employee.direct_reports == 43
      assert employee.parent_id == 43
    end

    test "update_employee/2 with invalid data returns error changeset" do
      employee = employee_fixture()
      assert {:error, %Ecto.Changeset{}} = Employees.update_employee(employee, @invalid_attrs)
      assert employee == Employees.get_employee!(employee.id)
    end

    test "delete_employee/1 deletes the employee" do
      employee = employee_fixture()
      assert {:ok, %Employee{}} = Employees.delete_employee(employee)
      assert_raise Ecto.NoResultsError, fn -> Employees.get_employee!(employee.id) end
    end

    test "change_employee/1 returns a employee changeset" do
      employee = employee_fixture()
      assert %Ecto.Changeset{} = Employees.change_employee(employee)
    end
  end
end
