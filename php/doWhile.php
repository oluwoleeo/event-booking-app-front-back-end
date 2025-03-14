<?php
    do {
        $diceRoll = rand(1, 6);
        echo "You rolled a $diceRoll\n";

        if ($diceRoll === 6){
            echo "Congrats! Jackpot!\n";
        }

        echo "Roll again? (y/n) ";
        $rollAgain = trim(fgets(STDIN));
    } while ($rollAgain === 'y');