<?php
interface Logger {
    function log(string $message): void;
}

trait Loggable{
    public function log(string $message): void{
        echo "Logging: $message\n";
    }
}
class User implements Logger {
    use Loggable;
    public function __construct(public string $name) {}

    public function save(): void {
        $this->log("User $this->name saved");
    }
}

$user = new User("Wole");
$user->save();