<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmailSubscriber>
 */
class EmailSubscriberFactory extends Factory
{
    protected $model = \App\Models\EmailSubscriber::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'status' => 'pending',
            'locale' => 'en',
            'source' => 'public_form',
            'confirmation_token' => fake()->sha256(),
            'unsubscribe_token' => null,
            'subscribed_ip' => fake()->ipv4(),
            'confirmed_ip' => null,
            'unsubscribed_ip' => null,
            'confirmation_sent_at' => now(),
            'confirmed_at' => null,
            'unsubscribed_at' => null,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'status' => 'active',
            'confirmation_token' => null,
            'unsubscribe_token' => fake()->sha256(),
            'confirmed_at' => now(),
            'confirmed_ip' => fake()->ipv4(),
        ]);
    }

    public function unsubscribed(): static
    {
        return $this->active()->state(fn () => [
            'status' => 'unsubscribed',
            'unsubscribed_at' => now(),
            'unsubscribed_ip' => fake()->ipv4(),
        ]);
    }
}
