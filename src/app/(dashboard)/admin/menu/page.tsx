import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Coffee, CupSoda, Search, Plus, Star, DollarSign } from "lucide-react";

const menuItems = [
  {
    name: "Hazelnut Velvet Latte",
    category: "Coffee",
    price: "$5.50",
    status: "Available",
  },
  {
    name: "Caramel Macchiato",
    category: "Coffee",
    price: "$5.20",
    status: "Available",
  },
  {
    name: "Matcha Latte",
    category: "Tea",
    price: "$4.80",
    status: "Unavailable",
  },
  {
    name: "Blueberry Cheesecake",
    category: "Dessert",
    price: "$4.50",
    status: "Available",
  },
];

export default function MenuPage() {
  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-8 text-[#fffaf5] shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#f5d5ae]">
              Coffee House
            </p>

            <h1 className="mt-2 text-4xl font-bold">Menu Management</h1>

            <p className="mt-3 max-w-2xl text-[#f6e7d4]">
              Manage your drinks, desserts, pricing, and availability from one
              place.
            </p>
          </div>

          <Button className="bg-[#fff8ef] text-[#5b3318] hover:bg-[#f4eadf]">
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-[#e4c8a7]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Items</CardTitle>
            <CupSoda className="h-5 w-5 text-[#8d5a2b]" />
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold text-[#3d2413]">42</p>
          </CardContent>
        </Card>

        <Card className="border-[#e4c8a7]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Best Seller</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>

          <CardContent>
            <p className="font-semibold text-[#3d2413]">Hazelnut Latte</p>
          </CardContent>
        </Card>

        <Card className="border-[#e4c8a7]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Average Price</CardTitle>
            <DollarSign className="h-5 w-5 text-[#8d5a2b]" />
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold text-[#3d2413]">$5.10</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}

      <Card className="border-[#e4c8a7]">
        <CardContent className="p-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input placeholder="Search menu..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}

      <Card className="border-[#e4c8a7]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-[#8d5a2b]" />
            Menu Items
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-[#7b5f46]">
                <th className="py-3">Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {menuItems.map((item) => (
                <tr key={item.name} className="border-b last:border-none">
                  <td className="py-4 font-medium text-[#3d2413]">
                    {item.name}
                  </td>

                  <td>{item.category}</td>

                  <td>{item.price}</td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
