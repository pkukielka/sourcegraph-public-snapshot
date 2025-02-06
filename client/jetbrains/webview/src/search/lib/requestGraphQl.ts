import { requestGraphQLCommon, type GraphQLResult } from '@sourcegraph/http-client'

import { getInstanceURL } from '..'
import { getCustomRequestHeaders } from '../js-to-java-bridge'

export const requestGraphQL = async <R, V = object>(
    request: string,
    variables: V,
): Promise<GraphQLResult<R>> => {
    const instanceURL = getInstanceURL()
    const customRequestHeaders = await getCustomRequestHeaders()

    return requestGraphQLCommon<R, V>({
        request: request,
        variables: variables,
        baseUrl: instanceURL,
        headers: {
            ...customRequestHeaders,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Sourcegraph-Should-Trace': new URLSearchParams(window.location.search).get('trace') || 'false'
        },
    }).toPromise()
}
