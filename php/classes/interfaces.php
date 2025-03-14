<?php

interface PaymentProcessor {
    function processPayment(float $amount): bool;
    function refundPayment(float $amount): bool;
}

abstract class OnlinePaymentProcessor implements PaymentProcessor {
    public function __construct(protected readonly string $apiKey){}

    abstract protected function validateApiKey(): bool;
    abstract protected function executePayment(float $amount): bool;
    abstract protected function executeRefund(float $amount): bool;

    public function processPayment(float $amount): bool{
        if (!$this->validateApiKey()){
            throw new Exception("Invalid API key");
        }

        return $this -> executePayment($amount);
    }

    public function refundPayment(float $amount): bool{
        if (!$this->validateApiKey()){
            throw new Exception("Invalid API key");
        }

        return $this -> executeRefund($amount);
    }

}

class StripeProcessor extends OnlinePaymentProcessor {
    protected function validateApiKey(): bool{
        return str_starts_with($this->apiKey, 'sk_');
    }

    protected function executePayment(float $amount): bool{
        echo "Processing Stripe payment of $amount\n";
        return true;
    }

    protected function executeRefund(float $amount): bool{
        echo "Processing Stripe refund of $amount\n";
        return true;
    }
}

class PaypalProcessor extends OnlinePaymentProcessor {
    protected function validateApiKey(): bool{
        return strlen($this->apiKey) === 32;
    }

    protected function executePayment(float $amount): bool{
        echo "Processing Paypal payment of $amount\n";
        return true;
    }

    protected function executeRefund(float $amount): bool{
        echo "Processing Paypal refund of $amount\n";
        return true;
    }
}

class CashPaymentProcessor implements PaymentProcessor {
    public function processPayment(float $amount): bool {
        echo "Cash payment...";
        return true;
    }

    public function refundPayment(float $amount): bool {
        echo "Cash refund...";
        return true;
    }
}

class OrderProcessor {
    public function __construct(private PaymentProcessor $paymentProcessor){}

    public function processOrder(float $amount, string | array $items): void{
        if (is_array($items)){
            $itemsList = implode(',', $items);
        } else{
            $itemsList = $items;
        }

        echo "Processing order of $amount for items $itemsList\n";

        if ($this->paymentProcessor->processPayment($amount)){
            echo "Order processed successfully\n";
        } else{
            echo "Order processing failed\n";
        }
    }

    public function refundOrder(float $amount): void{
        if ($this->paymentProcessor->refundPayment($amount)){
            echo "Order refunded successfully\n";
        } else{
            echo "Order refund failed\n";
        }
    }
}

$stripeProcessor = new StripeProcessor("sk_test_123456");
$paypalProcessor = new PaypalProcessor("valid_paypal_api_key_32charslong");
$cashProcessor = new CashPaymentProcessor();

$stripeOrder = new OrderProcessor($stripeProcessor);
$paypalOrder = new OrderProcessor($paypalProcessor);
$cashOrder = new OrderProcessor($cashProcessor);

$stripeOrder->processOrder(100, "Book");
$paypalOrder->processOrder(150, ["Book", "Movie"]);
$cashOrder->processOrder(50, ["Apple", "Orange"]);

$stripeOrder->refundOrder(25);
$paypalOrder->refundOrder(50);
$cashOrder->refundOrder(10);
