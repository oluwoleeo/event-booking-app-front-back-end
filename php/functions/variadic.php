<?php
    declare(strict_types=1);

    $numbers = [1, 2, 3];

    function sum(int ...$values): int{
        $sum = 0;
        foreach ($values as $value){
            $sum += $value;
        }
        return $sum;
        // return array_sum($values);
    }

    function introduceTeam(string $teamName, string ...$members): void{
        echo "Team: $teamName\n";
        echo "Members: ".implode(", ", $members).", count: ".count($members)."\n";
    }

    $children = ["Xavier", "Daphne"];
    introduceTeam("A Team", "Wole", "Toro");
    introduceTeam("B Team", "Wole", "Toro", ...$children);

    // echo sum(...$numbers);
