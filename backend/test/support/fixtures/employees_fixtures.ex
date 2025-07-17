defmodule AwesomeBackend.EmployeesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `AwesomeBackend.Employees` context.
  """

  @doc """
  Generate a employee.
  """
  def employee_fixture(attrs \\ %{}) do
    {:ok, employee} =
      attrs
      |> Enum.into(%{
        avatar: "some avatar",
        bio: "some bio",
        department: "some department",
        direct_reports: 42,
        email: "some email",
        location: "some location",
        name: "some name",
        parent_id: 42,
        phone: "some phone",
        skills: "some skills",
        start_date: ~D[2025-07-15],
        title: "some title"
      })
      |> AwesomeBackend.Employees.create_employee()

    employee
  end
end
