import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import SubscriptionForm from "@/components/subscriptionForm";

const EditForm = () => {
  return (
    <div className="container my-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">編集</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SubscriptionForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditForm;
