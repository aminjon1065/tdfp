<?php

namespace App\Modules\Staff\Controllers;

use App\Http\Controllers\Controller;
use App\Models\StaffMember;
use App\Modules\Staff\Repositories\StaffRepository;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PublicStaffController extends Controller
{
    public function __construct(private StaffRepository $repository) {}

    public function index(): Response
    {
        $hierarchy = $this->buildHierarchy(
            $this->repository->publicHierarchy()
        );

        return Inertia::render('public/staff/index', [
            'staffHierarchy' => $hierarchy,
        ]);
    }

    /**
     * @param  Collection<int, StaffMember>  $members
     * @return Collection<int, array<string, mixed>>
     */
    private function buildHierarchy(Collection $members, ?int $parentId = null): Collection
    {
        return $members
            ->where('parent_id', $parentId)
            ->values()
            ->map(function (StaffMember $member) use ($members): array {
                return [
                    'id' => $member->id,
                    'parent_id' => $member->parent_id,
                    'email' => $member->email,
                    'phone' => $member->phone,
                    'photo_url' => $member->photoUrl(),
                    'is_leadership' => $member->is_leadership,
                    'sort_order' => $member->sort_order,
                    'translations' => $member->translations,
                    'children' => $this->buildHierarchy($members, $member->id),
                ];
            });
    }
}
