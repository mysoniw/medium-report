CCA 시험 대비, 도메인 포 프롬프트 엔지니어링과 구조화된 출력입니다. 이 도메인은 전체 시험의 이십 퍼센트, 약 열두 문항을 차지하며, Claude에게 구조화된 출력을 안정적으로 생성시키는 아키텍처 역량을 평가합니다. 이 도메인의 핵심 철학은 단 한 문장으로 요약됩니다. Prompts are guidance, Code is law. 프롬프트는 안내일 뿐이고, 코드가 법이라는 뜻입니다.

먼저 가장 중요한 개념인 Three-Tier Reliability Model, 삼계층 신뢰성 모델부터 설명하겠습니다. 이 모델은 도메인 포의 핵심 중 핵심이므로 반드시 외워야 합니다. 레벨 원은 Prompt Guidance입니다. 시스템 프롬프트에 Always return valid JSON이라고 지시하는 방식인데, 이것은 확률적 넛지, 영어로 probabilistic nudge에 불과합니다. 확률 분포를 JSON 출력 쪽으로 강하게 이동시키지만, 다른 가능성을 완전히 제거하지는 않습니다. 실제로 마크다운 코드 펜스로 감싸거나, 설명 텍스트를 앞에 붙이거나, 스키마가 불일치하거나, 환각된 값을 생성하는 등 다양한 실패 모드가 존재합니다. 시험에서 프롬프트 강화로 시작하는 선택지가 보이면 즉시 제거하세요.

레벨 투는 Schema Enforcement, 스키마 강제입니다. tool-forcing이나 JSON Schema를 사용하여 구조적 준수를 보장합니다. total 필드가 number 타입인 것은 보장하지만, 그 숫자가 line items 합계와 일치하는지는 검증하지 않습니다. 영어 표현으로, a perfectly formatted check is not the same as a check that will clear, 완벽한 형식의 수표가 은행에서 통과되는 수표와 같지 않다는 비유가 이 한계를 잘 설명합니다.

레벨 쓰리는 Programmatic Validation, 프로그래밍적 검증입니다. 비즈니스 규칙 코드로 추출 데이터의 실제 정확성을 독립적으로 확인합니다. 여기서 중요한 것은 Claude에게 아무것도 묻지 않는다는 점입니다. 외부 ground truth에 대해 독립적으로 검증합니다. 시험은 항상 레벨 쓰리 답을 보상한다는 것을 기억하세요.

다음으로 tool-forcing을 살펴봅니다. tool choice 파라미터에는 네 가지 모드가 있습니다. 첫째, auto는 기본값으로 Claude가 도구 호출 여부와 대상을 자율 결정합니다. 둘째, any는 반드시 하나의 도구를 호출하되 어떤 도구인지는 Claude가 결정합니다. 셋째, tool과 name을 함께 지정하면 특정 도구를 강제 호출합니다. 넷째, none은 도구 호출을 금지하고 텍스트만 생성합니다. 구조화된 데이터 추출에서는 항상 tool과 name을 지정하는 tool-forcing이 정답입니다. 시험에서 any와 tool plus name의 차이를 정확히 구분해야 합니다. any는 아무 도구든 반드시 호출이고, tool plus name은 이 도구만 호출입니다.

Structured Output with JSON Schema에 대해 설명합니다. 도구 정의의 input schema는 JSON Schema 형식으로 출력 구조를 정의합니다. required로 필수 필드를 지정하여 누락을 방지하고, enum으로 허용 값 목록을 정의하여 환각을 방지합니다. 예를 들어 sentiment 필드에 positive, negative, neutral만 허용하면 Claude가 somewhat positive 같은 정의되지 않은 값을 생성할 수 없습니다. pattern으로는 정규식 매칭을 적용하여 날짜 형식 같은 제약을 걸 수 있습니다.

이제 Pydantic Parse와 Retry 패턴입니다. client dot messages dot parse는 Pydantic 모델을 직접 전달하여 타입된 출력을 받는 네이티브 SDK 메서드입니다. 여기서 중요한 함정이 있는데, with structured output는 LangChain 메서드이지 네이티브 Anthropic SDK가 아닙니다. 시험에서 네이티브 SDK로 구현하라는 문구가 나오면 이 선택지를 즉시 제거해야 합니다.

재시도 패턴에는 세 가지 유형이 있습니다. Blind retry는 에러 정보 없이 다시 해봐라고 하는 것으로 항상 오답입니다. Informed retry는 total은 백오십인데 line items 합계는 백칠십오입니다, 소스 문서를 재검토하세요처럼 구체적 에러 메시지를 포함하는 정답 패턴입니다. Unbounded retry는 성공할 때까지 반복하는 것으로 역시 항상 오답입니다. 정답 공식을 암기하세요. Informed, 구체적 에러 메시지 포함. Bounded, 이 회에서 삼 회 제한. Human escalation, 최대 재시도 후 인간 개입.

Prefill 기법은 어시스턴트 메시지의 시작 부분을 미리 채워서 출력 형식을 유도하는 방식입니다. 예를 들어 assistant content에 여는 중괄호를 넣으면 Claude가 그 이후부터 JSON을 이어서 생성합니다. 하지만 이것은 레벨 원 기법이므로 단독으로는 충분하지 않으며, 반드시 tool-forcing과 validation을 함께 사용해야 합니다.

Few-shot 프롬프팅은 입력과 출력 예시를 제공하여 추출 패턴을 학습시키는 기법입니다. 실제 문서를 처리하기 전에 두세 개의 예시 쌍을 보여주면 Claude가 패턴을 따라갑니다. 하지만 이것도 레벨 원 기법으로 프로덕션에서는 단독으로 충분하지 않습니다.

Anthropic이 공식 권장하는 XML 태그 구조화를 설명합니다. 시스템 프롬프트를 role, instructions, context, output format 같은 XML 태그로 섹션을 분리하면 Claude가 각 섹션을 명확히 구분하여 처리합니다. 마크다운 헤더보다 의미적 분리 효과가 뛰어나며, 복잡한 시스템 프롬프트에서 특히 효과적입니다.

컨텍스트 엔지니어링은 프롬프트 엔지니어링의 상위 개념입니다. 단순히 프롬프트를 잘 쓰는 것을 넘어, 에이전트가 각 단계에서 올바른 컨텍스트를 갖도록 시스템 전체를 설계하는 것입니다. Context Engineering is a superset of Prompt Engineering이라는 표현을 기억하세요.

시험에 자주 등장하는 안티패턴 다섯 가지를 정리합니다. 첫째, 시스템 프롬프트에 지시를 추가하여 출력 형식을 강제하려는 것. 이것은 확률적 넛지일 뿐입니다. 둘째, self-reported confidence, 즉 Claude에게 추출 신뢰도를 일에서 십 척도로 자체 평가하게 하는 것. 환각 데이터에도 높은 점수를 보고할 수 있습니다. LLM은 자기 출력의 정확성을 객관적으로 평가할 수 없습니다. 셋째, blind retry, 에러 정보 없이 다시 시도하라고만 하는 것. 같은 실수를 반복합니다. 넷째, unbounded retry, 성공할 때까지 무한 반복하는 것. 무한 루프 위험이 있습니다. 다섯째, hard failure만 또는 soft failure만 처리하는 불완전한 패턴. 반드시 둘 다 하나의 재시도 루프에서 처리해야 합니다.

마지막으로 시험 팁입니다. 시스템 프롬프트에 지시를 추가하여로 시작하는 선택지는 거의 항상 오답입니다. tool choice와 input schema가 포함된 선택지를 먼저 찾으세요. with structured output가 보이면 LangChain 함정이므로 즉시 제거하세요. 재시도 문제에서는 informed, bounded, human escalation 세 요소가 모두 있는 답을 고르세요. 검증 문제에서는 hard failure와 soft failure를 모두 처리하는 답이 정답입니다. 그리고 enum 제약은 카테고리형 필드에서 환각을 방지하는 레벨 투의 핵심 기능이라는 점을 기억하세요. 이상으로 도메인 포 프롬프트 엔지니어링과 구조화된 출력 강의를 마칩니다.