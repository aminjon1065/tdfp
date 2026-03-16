<?php
namespace App\Mail;
use App\Models\GrmCase;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GrmSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public GrmCase $case) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your complaint has been received - Ticket: ' . $this->case->ticket_number,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.grm.submitted',
        );
    }
}
