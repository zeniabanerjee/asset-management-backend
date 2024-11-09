-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "Devices" AS ENUM ('Phone', 'Watch', 'IMac', 'MacMini', 'MacBook');

-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('Admin', 'Employee');

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "device_type" "Devices" NOT NULL,
    "device_name" TEXT NOT NULL,
    "device_description" TEXT,
    "serial_no" TEXT NOT NULL,
    "device_assignment_id" TEXT,
    "assignee" TEXT,
    "is_outdated" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3),
    "employeeId" TEXT,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employee_name" TEXT NOT NULL,
    "employee_email" TEXT NOT NULL,
    "employee_password" TEXT,
    "employee_type" "EmployeeType" DEFAULT 'Employee',
    "employee_phone" TEXT NOT NULL,
    "employee_team" TEXT NOT NULL,
    "employee_status" "EmployeeStatus" NOT NULL DEFAULT 'Active',
    "created_at " TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "current_user" TEXT NOT NULL,
    "previous_users" TEXT[],
    "created_at " TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_serial_no_key" ON "devices"("serial_no");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_assignment_id_key" ON "devices"("device_assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_email_key" ON "employees"("employee_email");

-- CreateIndex
CREATE UNIQUE INDEX "history_device_id_key" ON "history"("device_id");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_current_user_fkey" FOREIGN KEY ("current_user") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
