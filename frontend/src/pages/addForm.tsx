import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

const formSchema = z.object({
  appName: z.string().min(1, "サブスク名を入力してください").max(20),
  link: z.string().url("正しいURLを入力してください"),
  price: z
    .string()
    .min(1, "金額を入力してください")
    .refine((value) => !isNaN(Number(value)), {
      message: "数値を入れてください",
    })
    .transform((value) => (value === "" ? "" : Number(value))),
  interval: z.enum(["month", "year"]),
  payment: z.string(),
  startMonth: z.date(),
  current: z.boolean(),
  endMonth: z.date().optional(),
});

const monthPaymentSchema = z
  .string()
  .refine((value) => !isNaN(Number(value)), {
    message: "数値を入れてください",
  })
  .transform((value) => (value === "" ? "" : Number(value)))
  .refine((value) => typeof value === "number" && value >= 1 && value <= 31, {
    message: "1から31の数値を入力してください",
  });

const yearPaymentSchema = z
  .string()
  .refine((value) => !isNaN(Number(value)), {
    message: "数値を入れてください",
  })
  .transform((value) => (value === "" ? "" : Number(value)))
  .refine((value) => typeof value === "number" && value >= 1 && value <= 12, {
    message: "1から12の数値を入力してください",
  });

const getSchema = (interval: string) => {
  return formSchema.extend({
    payment: interval === "month" ? monthPaymentSchema : yearPaymentSchema,
  });
};

const AddForm = () => {
  const [schema, setSchema] = useState(() => getSchema("month"));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      appName: "",
      link: "",
      price: "",
      interval: "month",
      payment: "",
      startMonth: undefined,
      current: true,
      endMonth: undefined,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const toggleValue = form.watch("current");
  const radioValue = form.watch("interval");

  useEffect(() => {
    setSchema(getSchema(radioValue));
    form.reset({}, { keepValues: true });
  }, [radioValue, form.reset]);

  return (
    <div className="container my-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">サブスク追加</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="appName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>サブスク名</FormLabel>
                    <FormControl>
                      <Input placeholder="example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="max-w-[10rem]">
                    <FormLabel>金額</FormLabel>
                    <FormControl>
                      <div className="flex items-baseline gap-2">
                        <Input
                          className="text-end"
                          placeholder="100"
                          {...field}
                        />
                        <Label>円</Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>支払い頻度</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="month" id="month" />
                          <Label htmlFor="month">毎月</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="year" id="year" />
                          <Label htmlFor="year">毎年</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {radioValue === "month" && (
                <FormField
                  control={form.control}
                  name="payment"
                  render={({ field }) => (
                    <FormItem className="max-w-[10rem]">
                      <FormLabel>支払日</FormLabel>
                      <FormControl>
                        <div className="flex items-baseline gap-2">
                          <Input
                            className="text-end"
                            {...field}
                            placeholder={"1-31"}
                          />
                          <Label>日</Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {radioValue === "year" && (
                <FormField
                  control={form.control}
                  name="payment"
                  render={({ field }) => (
                    <FormItem className="max-w-[10rem]">
                      <FormLabel>支払月</FormLabel>
                      <FormControl>
                        <div className="flex items-baseline gap-2">
                          <Input
                            className="text-end"
                            {...field}
                            placeholder={"1-12"}
                          />
                          <Label>月</Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="startMonth"
                render={({ field }) => (
                  <FormItem className="max-w-[10rem]">
                    <FormLabel>開始</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="current"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>現在</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!toggleValue && (
                <FormField
                  control={form.control}
                  name="endMonth"
                  render={({ field }) => (
                    <FormItem className={"max-w-[10rem]"}>
                      <FormLabel>終了</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit">追加</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddForm;
