import type { AuthenticatedUser } from '@sourcegraph/shared/src/auth'
import type { CurrentAuthStateResult, CurrentAuthStateVariables } from '@sourcegraph/shared/src/graphql-operations'
import { requestGraphQL } from '../search/lib/requestGraphQl'
import { gql } from '@sourcegraph/http-client'

export type SiteVersionAndCurrentAuthStateResult = CurrentAuthStateResult & {
    site: {
        productVersion: string
    }
}

// TODO: Could be deduplicated with `currentAuthStateQuery` in `shared/src/auth.ts`, using fragments
export const siteVersionAndUserQuery = gql`
    query SiteVersionAndCurrentUser {
        site {
            productVersion
        }
        currentUser {
            __typename
            id
            databaseID
            username
            avatarURL
            email
            displayName
            siteAdmin
            url
            settingsURL
            hasVerifiedEmail
            organizations {
                nodes {
                    id
                    name
                    displayName
                    url
                    settingsURL
                }
            }
            session {
                canSignOut
            }
            viewerCanAdminister
        }
    }
`

export interface SiteVersionAndCurrentUser {
    site: { productVersion: string } | null
    currentUser: AuthenticatedUser | null
}

export async function getSiteVersionAndAuthenticatedUser(instanceURL: string): Promise<SiteVersionAndCurrentUser> {
    if (!instanceURL) {
        return { site: null, currentUser: null }
    }

    const result = await requestGraphQL<SiteVersionAndCurrentAuthStateResult, CurrentAuthStateVariables>(siteVersionAndUserQuery, {}).catch(error => {
        console.error("Failed to get site and user data", error)
        return { data: null }
    })

    return result.data ?? { site: null, currentUser: null }
}
