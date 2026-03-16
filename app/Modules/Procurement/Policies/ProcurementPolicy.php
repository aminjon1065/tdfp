<?php
namespace App\Modules\Procurement\Policies;
use App\Models\User;
use App\Models\Procurement;

class ProcurementPolicy
{
    public function viewAny(User $user): bool { return $user->hasPermissionTo('procurement.view'); }
    public function create(User $user): bool { return $user->hasPermissionTo('procurement.create'); }
    public function update(User $user, Procurement $procurement): bool { return $user->hasPermissionTo('procurement.edit'); }
    public function delete(User $user, Procurement $procurement): bool { return $user->hasPermissionTo('procurement.delete'); }
}
