<?php
declare(strict_types=1);
// PHP 5 - types
// PHP 7 - strict types
    function add(int $a, int $b): int{
        return $a + $b;
    }

    echo add(2, 3);