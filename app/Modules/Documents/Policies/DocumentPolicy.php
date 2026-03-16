<?php
namespace App\Modules\Documents\Policies;
use App\Models\User;
use App\Models\Document;

class DocumentPolicy
{
    public function viewAny(User $user): bool { return $user->hasPermissionTo('documents.view'); }
    public function create(User $user): bool { return $user->hasPermissionTo('documents.create'); }
    public function update(User $user, Document $document): bool { return $user->hasPermissionTo('documents.edit'); }
    public function delete(User $user, Document $document): bool { return $user->hasPermissionTo('documents.delete'); }
}
