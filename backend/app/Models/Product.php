<?php

namespace App\Models;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'category_id',
        'name',
        'description',
        'price',
        'unit',
        'quantity_available',
        'status',
        'tags',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity_available' => 'integer',
        'tags' => 'array',
        'approved_at' => 'datetime',
    ];

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeForFarmer($query, $farmerId)
    {
        return $query->where('farmer_id', $farmerId);
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->orderBy('sort_order');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
