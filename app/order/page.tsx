import StepIndicator from '@/components/order/StepIndicator';

export default function OrderPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Your Wedding Invitation</h1>
      <StepIndicator currentStep={1} />
      <div className="mt-12">
        {/* Step content will be injected here or redirected to steps */}
        <p>Redirecting to first step...</p>
      </div>
    </div>
  );
}
