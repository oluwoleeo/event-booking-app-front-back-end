<?php
    $secret = "magic";
    $attempts = 0;
    $maxAttempts = 5;

    while($attempts < $maxAttempts) {
        echo "Guess the secret: ";
        $guess = trim(fgets(STDIN));

        ++$attempts;

        if($guess === $secret) {
            echo "Correct\n";
            break;
        } elseif ($attempts == $maxAttempts) {
            echo "Out of attempts\n";
        } else {
            echo "Wrong! Try again. Attempts left: " . ($maxAttempts - $attempts) . "\n";
        }
    }