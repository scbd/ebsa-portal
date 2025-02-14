

export async function queryIndex(searchQuery) {
    const { cbdApi }       = useRuntimeConfig().public;
    const result = await useFetch(`https://api.cbd.int/api/v2013/index/select`, { method: 'POST', body: searchQuery })

    const searchResult = {
        docs: result.response.docs,
        numFound: result.response.numFound
    }

    if (searchQuery.facet) { /// Normalize Facets   

        const facetResult = facetsToObject(result.facet_counts.facet_fields, searchQuery['facet.field']);
        searchResult.facets = facetResult;
        searchResult.facetPivot = result.facet_counts.facet_pivot;
    }

    return searchResult;

}

function facetsToObject(solrArray, facetFields) {

    var facets = {};
    if (!Array.isArray(facetFields)) {
        facetFields = [facetFields]
    }

    facetFields.forEach(function (field) {
        if (solrArray) {
            var mField = field.replace(/{.*}/, ''); //remove tags(${!ex=xxx}) is specified in field names
            for (var i = 0; i < solrArray[mField]?.length; i += 2) {
                if (!facets[mField])
                    facets[mField] = {};
                facets[mField][solrArray[mField][i]] = solrArray[mField][i + 1];
            }
        }
    });

    return facets;
};

function andOr(query, sep){

    sep = sep || 'AND';

    if (Array.isArray(query)) {

        query = query.map(function (criteria) {

            if (Array.isArray(criteria)) {
                return andOr(criteria, sep == "AND" ? "OR" : "AND");
            }

            return criteria;
        });

        query = '(' + query.join(' ' + sep + ' ') + ')';
    }

    return query;
}

function localizeFields(field, locale = 'EN') {
    return field.replace(/_EN_/ig, `_${locale.toUpperCase()}_`);
}
