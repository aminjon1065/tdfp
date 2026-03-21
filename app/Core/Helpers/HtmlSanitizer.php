<?php

namespace App\Core\Helpers;

use DOMDocument;
use DOMElement;
use DOMNode;
use DOMXPath;

class HtmlSanitizer
{
    /**
     * @var array<string, list<string>>
     */
    private array $allowedTags = [
        'a' => ['href', 'target', 'rel'],
        'blockquote' => [],
        'br' => [],
        'code' => [],
        'em' => [],
        'h2' => [],
        'h3' => [],
        'h4' => [],
        'hr' => [],
        'img' => ['src', 'alt', 'title'],
        'li' => [],
        'ol' => [],
        'p' => [],
        'pre' => [],
        'strong' => [],
        'table' => [],
        'tbody' => [],
        'td' => ['colspan', 'rowspan'],
        'th' => ['colspan', 'rowspan'],
        'thead' => [],
        'tr' => [],
        'u' => [],
        'ul' => [],
    ];

    public function sanitize(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return null;
        }

        $document = new DOMDocument('1.0', 'UTF-8');

        libxml_use_internal_errors(true);

        $document->loadHTML(
            mb_convert_encoding(
                '<div id="content-root">'.$html.'</div>',
                'HTML-ENTITIES',
                'UTF-8',
            ),
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        $root = $document->getElementById('content-root');

        if (! $root instanceof DOMElement) {
            libxml_clear_errors();

            return null;
        }

        $this->removeForbiddenNodes($root);
        $this->sanitizeNodeTree($root);

        $sanitizedHtml = '';

        foreach ($root->childNodes as $childNode) {
            $sanitizedHtml .= $document->saveHTML($childNode);
        }

        libxml_clear_errors();

        return trim($sanitizedHtml) !== '' ? trim($sanitizedHtml) : null;
    }

    private function removeForbiddenNodes(DOMElement $root): void
    {
        $xpath = new DOMXPath($root->ownerDocument);

        foreach (['script', 'style', 'iframe', 'object', 'embed', 'form'] as $tag) {
            $nodes = iterator_to_array($xpath->query('.//'.$tag, $root) ?: []);

            foreach ($nodes as $node) {
                $node->parentNode?->removeChild($node);
            }
        }
    }

    private function sanitizeNodeTree(DOMNode $node): void
    {
        foreach (iterator_to_array($node->childNodes) as $childNode) {
            if (! $childNode instanceof DOMElement) {
                continue;
            }

            $tagName = strtolower($childNode->tagName);

            if (! array_key_exists($tagName, $this->allowedTags)) {
                $this->unwrapNode($childNode);

                continue;
            }

            $this->sanitizeAttributes($childNode, $this->allowedTags[$tagName]);
            $this->sanitizeNodeTree($childNode);
        }
    }

    /**
     * @param  list<string>  $allowedAttributes
     */
    private function sanitizeAttributes(DOMElement $element, array $allowedAttributes): void
    {
        foreach (iterator_to_array($element->attributes) as $attribute) {
            $name = strtolower($attribute->nodeName);

            if (! in_array($name, $allowedAttributes, true)) {
                $element->removeAttribute($attribute->nodeName);

                continue;
            }

            $value = trim($attribute->nodeValue ?? '');

            if (in_array($name, ['href', 'src'], true) && ! $this->isSafeUrl($value)) {
                $element->removeAttribute($attribute->nodeName);
            }
        }

        if (strtolower($element->tagName) === 'a' && $element->hasAttribute('href')) {
            $element->setAttribute('rel', 'noopener noreferrer nofollow');

            if (! $element->hasAttribute('target')) {
                $element->setAttribute('target', '_blank');
            }
        }
    }

    private function unwrapNode(DOMElement $element): void
    {
        $parentNode = $element->parentNode;

        if (! $parentNode) {
            return;
        }

        while ($element->firstChild) {
            $parentNode->insertBefore($element->firstChild, $element);
        }

        $parentNode->removeChild($element);
    }

    private function isSafeUrl(string $url): bool
    {
        if ($url === '') {
            return false;
        }

        if (str_starts_with($url, '/')) {
            return true;
        }

        if (preg_match('/^(https?:)?\/\//i', $url) === 1) {
            return true;
        }

        if (str_starts_with($url, 'mailto:')) {
            return true;
        }

        return false;
    }
}
