-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_codeTaskId_fkey";

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_codeTaskId_fkey";

-- DropForeignKey
ALTER TABLE "TheoryQuestion" DROP CONSTRAINT "TheoryQuestion_taskId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_codeTaskId_fkey" FOREIGN KEY ("codeTaskId") REFERENCES "CodeTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_codeTaskId_fkey" FOREIGN KEY ("codeTaskId") REFERENCES "CodeTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheoryQuestion" ADD CONSTRAINT "TheoryQuestion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
