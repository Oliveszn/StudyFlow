import { planComparisonConfig } from "@/config/pricing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CircleCheck } from "lucide-react";

export default function PlanCompare() {
  return (
    <section className="my-20 ">
      <h1 className="font-medium leading-tight text-[clamp(1.8rem,calc(1.8rem+(2.8-1.8)*((100vw-36rem)/(144-36))),2.8rem)] text-text-primary whitespace-nowrap mb-12 text-center">
        Compare plans and features
      </h1>

      <div className="space-y-4">
        {planComparisonConfig.parents.map((plans, parentIndex) => (
          <div key={plans.id} className="">
            <div
              className="w-full bg-gray sticky shadow-sm"
              style={{
                top: 0,
                zIndex: planComparisonConfig.parents.length - parentIndex,
              }}
            >
              <h2 className="px-6 py-4 font-bold text-xl text-gray-800 ">
                {plans.title}
              </h2>
            </div>

            <div className="border border-gray-200 rounded-b-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                    <TableHead className="w-[40%] py-4 px-6 text-base font-semibold text-gray-700">
                      Feature
                    </TableHead>
                    <TableHead className="text-center py-4 px-6 text-base font-semibold text-gray-700">
                      Personal
                    </TableHead>
                    <TableHead className="text-center py-4 px-6 text-base font-semibold text-gray-700">
                      Team
                    </TableHead>
                    <TableHead className="text-center py-4 px-6 text-base font-semibold text-gray-700">
                      Enterprise
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.features.map((feature, index) => (
                    <TableRow
                      key={feature.name}
                      className={`
                        border-b border-gray-100 
                        hover:bg-blue-50/50 
                        transition-colors
                       
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      `}
                    >
                      <TableCell className="font-medium py-5 px-6 text-gray-700">
                        {feature.name}
                      </TableCell>

                      <TableCell className="text-center py-5 px-6">
                        {feature.availability.personal ? (
                          <div className="flex justify-center items-center">
                            <CircleCheck
                              aria-label="Available"
                              className="size-4 text-green-500"
                            />
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell className="text-center py-5 px-6">
                        {feature.availability.team ? (
                          <div className="flex justify-center items-center">
                            <CircleCheck
                              aria-label="Available"
                              className="size-4 text-green-500"
                            />
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell className="text-center py-5 px-6">
                        {feature.availability.enterprise ? (
                          <div className="flex justify-center items-center">
                            <CircleCheck
                              aria-label="Available"
                              className="size-4 text-green-500"
                            />
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
